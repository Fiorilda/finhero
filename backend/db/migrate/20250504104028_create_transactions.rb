class CreateTransactions < ActiveRecord::Migration[8.0]
  def change
    create_table :transactions do |t|
      t.decimal :amount, precision: 10, scale: 2, null: false
      t.string :transaction_type, null: false
      t.string :category
      t.string :description
      t.string :status, default: 'pending'
      t.references :user, null: false, foreign_key: true
      t.references :from_account, foreign_key: { to_table: :bank_accounts }
      t.references :to_account, foreign_key: { to_table: :bank_accounts }
      t.timestamps
    end

    add_index :transactions, :transaction_type
    add_index :transactions, :status
  end
end
