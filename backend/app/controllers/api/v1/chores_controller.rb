module Api
  module V1
    class ChoresController < BaseController
      before_action :set_chore, only: [:show, :update, :destroy, :complete]

      def index
        @chores = if current_user.role == 'parent'
                    Chore.where(child_id: Child.where(parent_id: current_user.id))
                  else
                    Chore.where(child_id: current_user.id)
                  end
        render json: @chores, each_serializer: ChoreSerializer
      end

      def show
        render json: @chore, serializer: ChoreSerializer
      end

      def create
        @chore = Chore.new(chore_params)
        if @chore.save
          render json: @chore, serializer: ChoreSerializer, status: :created
        else
          render json: { errors: @chore.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @chore.update(chore_params)
          render json: @chore, serializer: ChoreSerializer
        else
          render json: { errors: @chore.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        @chore.destroy
        head :no_content
      end

      def complete
        if @chore.child_id == current_user.id || current_user.role == 'parent'
          ActiveRecord::Base.transaction do
            @chore.completed = true
            @chore.last_completed = Time.current
            @chore.save!

            # Create reward transaction
            child = Child.find(@chore.child_id)
            parent = child.parent
            parent_account = parent.bank_accounts.first
            child_account = child.bank_accounts.first

            if parent_account && child_account
              Transaction.create!(
                amount: @chore.value,
                transaction_type: 'chore',
                category: 'reward',
                description: "Reward for completing chore: #{@chore.name}",
                status: 'completed',
                user: parent,
                from_account: parent_account,
                to_account: child_account
              )

              # Update account balances
              parent_account.balance -= @chore.value
              parent_account.save!

              child_account.balance += @chore.value
              child_account.save!
            end
          end

          render json: @chore, serializer: ChoreSerializer
        else
          render json: { error: 'Unauthorized' }, status: :unauthorized
        end
      rescue StandardError => e
        render json: { error: e.message }, status: :unprocessable_entity
      end

      private

      def set_chore
        @chore = Chore.find(params[:id])
      end

      def chore_params
        params.require(:chore).permit(:name, :value, :due_day, :enabled, :recurrence, :child_id)
      end
    end
  end
end
