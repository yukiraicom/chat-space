FactoryGirl.define do
  factory :user do
    password = Faker::Internet.password(8)
    name Faker::Name.last_name
    email Faker::Internet.free_email
    password password
    password_confirmation password
  end
  #Fakerの後の::nameなどについて
  #https://github.com/stympy/faker/blob/master/doc/name.md
  #こんな感じで書かれている
end
