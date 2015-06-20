class WelcomeController < ApplicationController
  def index
    @msg = "Hi there!"
  end

  def numbers
    @numbers = (offset..(offset + limit)).to_a
    respond_to do |format|
      format.json do
        expires_in 1.minute, public: true
        fresh_when etag: [@numbers.first, @numbers.last]
      end
    end
  end

  private
    def offset
      params[:offset].to_i
    end
    def limit
      params[:limit].to_i
    end
end
