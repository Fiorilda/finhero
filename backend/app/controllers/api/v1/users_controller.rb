module Api
  module V1
    class UsersController < BaseController
      skip_before_action :authenticate_request, only: [:create]
      before_action :set_user, only: [:show, :update, :destroy]

      def index
        @users = User.all
        render json: @users, each_serializer: UserSerializer
      end

      def show
        render json: @user, serializer: UserSerializer
      end

      def create
        @user = User.new(user_params)
        if @user.save
          render json: @user, serializer: UserSerializer, status: :created
        else
          render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @user.update(user_params)
          render json: @user, serializer: UserSerializer
        else
          render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        @user.destroy
        head :no_content
      end

      private

      def set_user
        @user = User.find(params[:id])
      end

      def user_params
        params.require(:user).permit(:name, :email, :avatar, :role, :pin)
      end
    end
  end
end
