module Api
  module V1
    class ChildrenController < BaseController
      before_action :set_child, only: [:show, :update, :destroy, :add_xp, :complete_quiz]

      def index
        @children = if current_user.role == 'parent'
                     Child.where(parent_id: current_user.id)
                   else
                     Child.where(id: current_user.id)
                   end
        render json: @children, each_serializer: ChildSerializer
      end

      def show
        render json: @child, serializer: ChildSerializer
      end

      def create
        @child = Child.new(child_params)
        if @child.save
          render json: @child, serializer: ChildSerializer, status: :created
        else
          render json: { errors: @child.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @child.update(child_params)
          render json: @child, serializer: ChildSerializer
        else
          render json: { errors: @child.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        @child.destroy
        head :no_content
      end

      def add_xp
        amount = params[:xp_amount].to_i
        @child.xp += amount
        if @child.save
          render json: @child, serializer: ChildSerializer
        else
          render json: { errors: @child.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def complete_quiz
        quiz = Quiz.find(params[:quiz_id])
        unless @child.completed_quizzes.include?(quiz.id.to_s)
          @child.completed_quizzes << quiz.id
          @child.xp += quiz.xp_reward
          if @child.save
            render json: @child, serializer: ChildSerializer
          else
            render json: { errors: @child.errors.full_messages }, status: :unprocessable_entity
          end
        else
          render json: { message: 'Quiz already completed' }, status: :unprocessable_entity
        end
      end

      private

      def set_child
        @child = Child.find(params[:id])
      end

      def child_params
        params.require(:child).permit(:name, :age, :email, :phone, :school, :avatar, :is_active, :parent_id)
      end
    end
  end
end
