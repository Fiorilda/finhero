class CreateChildren < ActiveRecord::Migration[8.0]
  def change
    create_table :children do |t|
      t.string :name, null: false
      t.integer :age, null: false
      t.string :email
      t.string :phone
      t.string :school
      t.string :avatar
      t.boolean :is_active, default: true
      t.references :parent, null: false, foreign_key: true
      t.integer :xp, default: 0
      t.timestamps
    end

    add_index :children, :email, unique: true
  end
end
