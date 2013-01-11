# A sample Guardfile
# More info at https://github.com/guard/guard#readme

require "./compile"

interactor :off

guard 'compass' do
  watch(/^sass\/(.*)\.s[ac]ss/)
end

module ::Guard
  class Closure < ::Guard::Guard

    def initialize(watchers = [], options = {})
      super
    end

    def start
      true
    end

    def stop
      true
    end

    def reload
      true
    end

    def run_all
      true
    end

    def run_on_changes(paths = [])
      build_js
      true
    end
  end

  class Jsunit < ::Guard::Guard

    def initialize(watchers = [], options = {})
      super
    end

    def start
      true
    end

    def stop
      true
    end

    def reload
      true
    end

    def run_all
      true
    end

    def run_on_changes(paths = [])
      paths.each do |p|
        create_test_for_mode(p)
      end

      true
    end
  end
end

guard 'jsunit' do
  watch(/^modes\/(.*)\.html/)
end

guard 'closure' do
  watch(/^js\/modes\/(.*)\.js/)
  watch(/^js\/vendor\/(.*)\.js/)
  watch(/^js\/app\.js/)
  watch(/^js\/mode\.js/)
  watch(/^js\/util\.js/)
end