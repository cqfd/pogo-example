class WelcomeController < ApplicationController
  def index
    @msg = "Hi there!"
  end
  def numbers
    offset = params[:offset].to_i
    limit = params[:limit].to_i
    respond_to do |format|
      format.html
      format.json { render json: (offset..(offset + limit)).to_a }
    end
  end
end
