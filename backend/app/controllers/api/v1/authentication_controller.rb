module Api
  module V1
    class AuthenticationController < ApplicationController
      def login
        @user = User.find_by(email: params[:email])
        if @user&.authenticate(params[:pin])
          token = JsonWebToken.encode(user_id: @user.id)
          time = Time.now + 24.hours.to_i
          render json: {
            token: token,
            exp: time.strftime("%m-%d-%Y %H:%M"),
            user: UserSerializer.new(@user).as_json
          }, status: :ok
        else
          render json: { error: 'unauthorized' }, status: :unauthorized
        end
      end
    end
  end
end
