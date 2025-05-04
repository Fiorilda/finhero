class CreateInvestments < ActiveRecord::Migration[8.0]
  def change
    create_table :investments do |t|
      t.string :symbol, null: false
      t.string :name, null: false
      t.decimal :shares, precision: 10, scale: 4, null: false
      t.decimal :purchase_price, precision: 10, scale: 2, null: false
      t.decimal :current_price, precision: 10, scale: 2, null: false
      t.date :purchase_date, null: false
      t.references :child, null: false, foreign_key: true
      t.timestamps
    end

    add_index :investments, [:child_id, :symbol]
  end
end
