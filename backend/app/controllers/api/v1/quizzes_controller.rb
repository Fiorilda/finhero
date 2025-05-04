module Api
  module V1
    class QuizzesController < BaseController
      before_action :set_quiz, only: [:show, :update, :destroy, :submit_answers]

      def index
        @quizzes = if current_user.role == 'child'
          child = Child.find(current_user.id)
          Quiz.where('? = ANY(for_age_groups)', child.age)
        else
          Quiz.all
        end
        render json: @quizzes, each_serializer: QuizSerializer
      end

      def show
        render json: @quiz, serializer: QuizSerializer
      end

      def create
        @quiz = Quiz.new(quiz_params)
        if @quiz.save
          render json: @quiz, serializer: QuizSerializer, status: :created
        else
          render json: { errors: @quiz.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @quiz.update(quiz_params)
          render json: @quiz, serializer: QuizSerializer
        else
          render json: { errors: @quiz.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        @quiz.destroy
        head :no_content
      end

      def submit_answers
        answers = params[:answers]
        correct_answers = 0
        total_questions = @quiz.quiz_questions.count
        results = []

        ActiveRecord::Base.transaction do
          answers.each do |answer|
            question = @quiz.quiz_questions.find(answer[:question_id])
            is_correct = question.correct_option == answer[:selected_option]
            correct_answers += 1 if is_correct

            results << {
              question_id: question.id,
              correct: is_correct,
              explanation: question.explanation
            }
          end

          score_percentage = (correct_answers.to_f / total_questions * 100).round(2)
          xp_earned = (score_percentage >= 70) ? @quiz.xp_reward : 0

          if current_user.role == 'child'
            child = Child.find(current_user.id)
            child.xp += xp_earned
            child.completed_quizzes << @quiz.id unless child.completed_quizzes.include?(@quiz.id)
            child.save!
          end

          render json: {
            quiz_id: @quiz.id,
            score: score_percentage,
            correct_answers: correct_answers,
            total_questions: total_questions,
            xp_earned: xp_earned,
            results: results
          }
        end
      rescue StandardError => e
        render json: { error: e.message }, status: :unprocessable_entity
      end

      def search
        query = params[:query]
        difficulty = params[:difficulty]
        category = params[:category]
        age = params[:age]

        @quizzes = Quiz.all

        @quizzes = @quizzes.where('title ILIKE ? OR description ILIKE ?', "%#{query}%", "%#{query}%") if query.present?
        @quizzes = @quizzes.where(difficulty: difficulty) if difficulty.present?
        @quizzes = @quizzes.where(category: category) if category.present?
        @quizzes = @quizzes.where('? = ANY(for_age_groups)', age.to_i) if age.present?

        render json: @quizzes, each_serializer: QuizSerializer
      end

      private

      def set_quiz
        @quiz = Quiz.find(params[:id])
      end

      def quiz_params
        params.require(:quiz).permit(
          :title,
          :description,
          :difficulty,
          :xp_reward,
          :category,
          :completion_time,
          :image_url,
          for_age_groups: [],
          quiz_questions_attributes: [
            :id,
            :question,
            :correct_option,
            :explanation,
            options: []
          ]
        )
      end
    end
  end
end
