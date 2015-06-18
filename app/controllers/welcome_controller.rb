class WelcomeController < ApplicationController
  def index
    render(plain: "Hi there!")
  end
end
