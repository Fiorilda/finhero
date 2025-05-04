FactoryBot.define do
  factory :child do
    name { "MyString" }
    age { 1 }
    email { "MyString" }
    phone { "MyString" }
    school { "MyString" }
    avatar { "MyString" }
    is_active { false }
    parent { nil }
    xp { 1 }
  end
end
