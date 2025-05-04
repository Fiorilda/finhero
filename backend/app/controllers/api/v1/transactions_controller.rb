module Api
  module V1
    class TransactionsController < BaseController
      before_action :set_transaction, only: [:show, :update, :destroy]

      def index
        @transactions = if current_user.role == 'parent'
                         Transaction.where(user: current_user)
                                  .or(Transaction.where(user: Child.where(parent_id: current_user.id)))
                       else
                         Transaction.where(user: current_user)
                       end
        render json: @transactions, each_serializer: TransactionSerializer
      end

      def show
        render json: @transaction, serializer: TransactionSerializer
      end

      def create
        @transaction = Transaction.new(transaction_params)
        @transaction.user = current_user

        if @transaction.save
          # Update account balances
          if @transaction.from_account
            @transaction.from_account.balance -= @transaction.amount
            @transaction.from_account.save
          end

          if @transaction.to_account
            @transaction.to_account.balance += @transaction.amount
            @transaction.to_account.save
          end

          render json: @transaction, serializer: TransactionSerializer, status: :created
        else
          render json: { errors: @transaction.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @transaction.update(transaction_params)
          render json: @transaction, serializer: TransactionSerializer
        else
          render json: { errors: @transaction.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        @transaction.destroy
        head :no_content
      end

      private

      def set_transaction
        @transaction = Transaction.find(params[:id])
      end

      def transaction_params
        params.require(:transaction).permit(
          :amount,
          :transaction_type,
          :category,
          :description,
          :status,
          :from_account_id,
          :to_account_id
        )
      end
    end
  end
end
