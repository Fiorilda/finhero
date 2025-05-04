module Api
  module V1
    class FinanceVideosController < BaseController
      before_action :set_finance_video, only: [:show, :update, :destroy, :increment_views, :toggle_like]

      def index
        @finance_videos = if current_user.role == 'child'
          child = Child.find(current_user.id)
          FinanceVideo.where('? = ANY(for_age_groups)', child.age)
        else
          FinanceVideo.all
        end
        render json: @finance_videos, each_serializer: FinanceVideoSerializer
      end

      def show
        render json: @finance_video, serializer: FinanceVideoSerializer
      end

      def create
        @finance_video = FinanceVideo.new(finance_video_params)
        if @finance_video.save
          render json: @finance_video, serializer: FinanceVideoSerializer, status: :created
        else
          render json: { errors: @finance_video.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @finance_video.update(finance_video_params)
          render json: @finance_video, serializer: FinanceVideoSerializer
        else
          render json: { errors: @finance_video.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        @finance_video.destroy
        head :no_content
      end

      def increment_views
        @finance_video.views += 1
        if @finance_video.save
          render json: @finance_video, serializer: FinanceVideoSerializer
        else
          render json: { errors: @finance_video.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def toggle_like
        @finance_video.likes = params[:liked] ? @finance_video.likes + 1 : @finance_video.likes - 1
        if @finance_video.save
          render json: @finance_video, serializer: FinanceVideoSerializer
        else
          render json: { errors: @finance_video.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def search
        query = params[:query]
        tags = params[:tags]
        age = params[:age]

        @finance_videos = FinanceVideo.all

        @finance_videos = @finance_videos.where('title ILIKE ? OR description ILIKE ?', "%#{query}%", "%#{query}%") if query.present?
        @finance_videos = @finance_videos.where('? = ANY(tags)', tags) if tags.present?
        @finance_videos = @finance_videos.where('? = ANY(for_age_groups)', age.to_i) if age.present?

        render json: @finance_videos, each_serializer: FinanceVideoSerializer
      end

      private

      def set_finance_video
        @finance_video = FinanceVideo.find(params[:id])
      end

      def finance_video_params
        params.require(:finance_video).permit(
          :title,
          :description,
          :thumbnail_url,
          :video_url,
          :duration,
          tags: [],
          for_age_groups: []
        )
      end
    end
  end
end
