class Message < ApplicationRecord
  belongs_to :group
  belongs_to :user

  validates :content, presence: true, unless: :image?
  #contentで空ではないか（presence）確認。（image以外で）
  mount_uploader :image, ImageUploader
#画像のやつ
end
