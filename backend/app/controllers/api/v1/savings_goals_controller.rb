module Api
  module V1
    class SavingsGoalsController < BaseController
      before_action :set_savings_goal, only: [:show, :update, :destroy, :contribute]

      def index
        @savings_goals = if current_user.role == 'parent'
                          SavingsGoal.where(child_id: Child.where(parent_id: current_user.id))
                        else
                          SavingsGoal.where(child_id: current_user.id)
                        end
        render json: @savings_goals, each_serializer: SavingsGoalSerializer
      end

      def show
        render json: @savings_goal, serializer: SavingsGoalSerializer
      end

      def create
        @savings_goal = SavingsGoal.new(savings_goal_params)
        if @savings_goal.save
          render json: @savings_goal, serializer: SavingsGoalSerializer, status: :created
        else
          render json: { errors: @savings_goal.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @savings_goal.update(savings_goal_params)
          render json: @savings_goal, serializer: SavingsGoalSerializer
        else
          render json: { errors: @savings_goal.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        @savings_goal.destroy
        head :no_content
      end

      def contribute
        amount = params[:amount].to_d
        from_account = BankAccount.find(params[:from_account_id])

        if from_account.balance >= amount
          ActiveRecord::Base.transaction do
            # Create transaction record
            transaction = Transaction.create!(
              amount: amount,
              transaction_type: 'savings_goal',
              category: 'contribution',
              description: "Contribution to savings goal: #{@savings_goal.name}",
              status: 'completed',
              user: current_user,
              from_account: from_account
            )

            # Update savings goal progress
            @savings_goal.current_amount += amount
            @savings_goal.completed = @savings_goal.current_amount >= @savings_goal.target_amount
            @savings_goal.save!

            # Update account balance
            from_account.balance -= amount
            from_account.save!
          end

          render json: @savings_goal, serializer: SavingsGoalSerializer
        else
          render json: { error: 'Insufficient funds' }, status: :unprocessable_entity
        end
      rescue StandardError => e
        render json: { error: e.message }, status: :unprocessable_entity
      end

      private

      def set_savings_goal
        @savings_goal = SavingsGoal.find(params[:id])
      end

      def savings_goal_params
        params.require(:savings_goal).permit(:name, :target_amount, :target_date, :child_id, :image_url)
      end
    end
  end
end
