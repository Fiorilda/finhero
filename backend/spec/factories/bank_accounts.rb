FactoryBot.define do
  factory :bank_account do
    name { "MyString" }
    account_type { "MyString" }
    balance { "9.99" }
    number { "MyString" }
    is_default { false }
    owner { nil }
  end
end
