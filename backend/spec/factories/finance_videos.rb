FactoryBot.define do
  factory :finance_video do
    title { "MyString" }
    description { "MyText" }
    thumbnail_url { "MyString" }
    video_url { "MyString" }
    duration { "MyString" }
    likes { 1 }
    views { 1 }
  end
end
