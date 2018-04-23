#bundle exec rspec spec/controllers/messages_controller_spec.rb
#上記コマンドは上の方でやらないとrails_helperとかの読み込みに失敗する
require './spec/rails_helper'

describe MessagesController do
  let(:group) { create(:group) }
  let(:user) { create(:user) }

  describe '#index' do
    context 'log in' do
      before do
        login user
        get :index, params: { group_id: group.id }
      end
      # loginはcontroller_macrosで宣言

      it 'assigns @message' do
        expect(assigns(:message)).to be_a_new(Message)
      end
      #assignメソッドはassign(:message)と書くことで@messageに代入されたオブジェクトになる。
      #be_a_newメソッドは対象が引数で指定したクラスのインスタンスかつも保存のレコードであるかを確認するメソッド。

      it 'assigns @group' do
        expect(assigns(:group)).to eq group
      end


      it 'renders index' do
        expect(response).to render_template :index
      end
    end
    #responseは遷移先のビュー。render_template :indexはindexアクションの先のビュー。

    context 'not log in' do
      before do
        get :index, params: { group_id: group.id }
      end

      it 'redirects to new_user_session_path' do
        expect(response).to redirect_to(new_user_session_path)
      end
    end
  end

  describe "#create" do
    let(:params) { { group_id: group.id, user_id: user.id, message: attributes_for(:message) } }
    #attributes_forはFactoryGirlによって定義されるメソッド。
    #オブジェクトを生成せずにハッシュを生成する。
    #build(:message)messageのオフジェクトを生成する。

    context 'log in' do
      before do
        login user
      end

      context "can save" do
          subject {
            post :create, #postメソッドで疑似的にリクエストを出した結果
            params: params
          }

          it 'count up message' do
            expect{ subject }.to change(Message, :count).by(1)
            #chamgeはmessageモデルのレコードの総数が増えたか確認するメソッド。
            #by(1)で１つという意味
          end

          it 'redirects to group_messages_path' do
            subject
            expect(response).to redirect_to(group_messages_path(group))
          end
          #responseは遷移先のビュー。
      end

      context 'can not save' do
        let(:invalid_params) { { group_id: group.id, user_id: user.id, message: attributes_for(:message, content: nil, image: nil) } }
	#:invakid_paramsを引数にすることで意図的にメッセージの保存に失敗する場合を再現する。
        subject {
          post:create,
          params: invalid_params
	#let(:invalid_params)で書いたinvalid_paramsを使っている。
	#invalid_paramsはその後の{ {group.......}}になる。
        }

        it 'does not count up' do
          expect{ subject }.not_to change(Message, :count)
	#レコード数が変化しないことを確かめるコード。
        end

        it 'render index' do
          subject
          expect(response).to render_template :index
        end
	#コントローラーで保存に失敗した時はindexに飛ぶように書いてある。
      end
    end

    context "not log in" do

      it 'redirects to new_user_session_path' do
        post :create, params: params
        expect(response).to redirect_to(new_user_session_path)
	#responseは遷移先のビュー
      end
    end
  end
end
