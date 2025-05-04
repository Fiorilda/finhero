Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"

  namespace :api do
    namespace :v1 do
      post 'auth/login', to: 'authentication#login'

      resources :users

      resources :children do
        member do
          post :add_xp
          post :complete_quiz
        end
      end

      resources :bank_accounts

      resources :transactions

      resources :savings_goals do
        member do
          post :contribute
        end
      end

      resources :chores do
        member do
          post :complete
        end
      end

      resources :finance_videos do
        member do
          post :increment_views
          post :toggle_like
        end
        collection do
          get :search
        end
      end

      resources :quizzes do
        member do
          post :submit_answers
        end
        collection do
          get :search
        end
        resources :quiz_questions, only: [:index, :show, :create, :update, :destroy]
      end
    end
  end
end
