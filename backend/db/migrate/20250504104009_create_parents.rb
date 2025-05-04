class CreateParents < ActiveRecord::Migration[8.0]
  def change
    create_table :parents do |t|
      t.string :name, null: false
      t.string :email, null: false
      t.string :phone
      t.string :avatar

      t.timestamps
    end

    add_index :parents, :email, unique: true
  end
end
