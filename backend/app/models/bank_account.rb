class BankAccount < ApplicationRecord
  belongs_to :owner, polymorphic: true
end
