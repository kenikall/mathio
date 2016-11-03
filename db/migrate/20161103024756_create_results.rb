class CreateResults < ActiveRecord::Migration[5.0]
  def change
    create_table :results do |t|
      t.references :leader, foreign_key: true
      t.references :game, foreign_key: true

      t.timestamps
    end
  end
end
