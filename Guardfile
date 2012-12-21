# A sample Guardfile
# More info at https://github.com/guard/guard#readme

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
      return true if paths.include?("js/app.min.js")
      return true if paths.include?("js/mode.min.js")
      return true if paths.include?("js/bootstrap.min.js")
      
      `java -jar compiler-latest/compiler.jar --js js/bootstrap.js --compilation_level=ADVANCED_OPTIMIZATIONS --debug=true > js/bootstrap.min.js`
      `closure-library-20121212-r2367/closure/bin/build/closurebuilder.py --root=closure-library-20121212-r2367/ --root=js/ --namespace="ww.app" --output_mode=compiled --compiler_flags="--compilation_level=ADVANCED_OPTIMIZATIONS" --compiler_flags="--debug=true" --compiler_jar=compiler-latest/compiler.jar --output_file=js/app.min.js`
      `closure-library-20121212-r2367/closure/bin/build/closurebuilder.py --root=closure-library-20121212-r2367/ --root=js/ --namespace="ww.mode" --output_mode=compiled --compiler_flags="--compilation_level=ADVANCED_OPTIMIZATIONS" --compiler_flags="--debug=true" --compiler_jar=compiler-latest/compiler.jar --output_file=js/mode.min.js`
      true
    end
  end
end

guard 'closure' do
  watch(/^js\/(.*)\.js/)
end