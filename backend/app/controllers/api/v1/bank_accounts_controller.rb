module Api
  module V1
    class BankAccountsController < BaseController
      before_action :set_bank_account, only: [:show, :update, :destroy]

      def index
        @bank_accounts = if current_user.role == 'parent'
                          BankAccount.where(owner: current_user)
                        else
                          BankAccount.where(owner: current_user)
                                   .or(BankAccount.where(owner: Child.find(current_user.id)))
                        end
        render json: @bank_accounts, each_serializer: BankAccountSerializer
      end

      def show
        render json: @bank_account, serializer: BankAccountSerializer
      end

      def create
        @bank_account = BankAccount.new(bank_account_params)
        if @bank_account.save
          render json: @bank_account, serializer: BankAccountSerializer, status: :created
        else
          render json: { errors: @bank_account.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @bank_account.update(bank_account_params)
          render json: @bank_account, serializer: BankAccountSerializer
        else
          render json: { errors: @bank_account.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        @bank_account.destroy
        head :no_content
      end

      private

      def set_bank_account
        @bank_account = BankAccount.find(params[:id])
      end

      def bank_account_params
        params.require(:bank_account).permit(:name, :account_type, :balance, :number, :is_default, :owner_type, :owner_id)
      end
    end
  end
end
