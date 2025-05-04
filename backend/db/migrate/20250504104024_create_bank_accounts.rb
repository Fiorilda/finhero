class CreateBankAccounts < ActiveRecord::Migration[8.0]
  def change
    create_table :bank_accounts do |t|
      t.string :name, null: false
      t.string :account_type, null: false
      t.decimal :balance, precision: 10, scale: 2, default: 0.0
      t.string :number, null: false
      t.boolean :is_default, default: false
      t.references :owner, polymorphic: true, null: false
      t.timestamps
    end

    add_index :bank_accounts, :number, unique: true
    add_index :bank_accounts, [:owner_type, :owner_id]
  end
end
