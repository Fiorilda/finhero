FactoryBot.define do
  factory :quiz do
    title { "MyString" }
    description { "MyText" }
    difficulty { "MyString" }
    xp_reward { 1 }
    category { "MyString" }
    completion_time { "MyString" }
    image_url { "MyString" }
  end
end
