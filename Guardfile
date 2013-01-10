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
      
      debug_flag = %Q{--define='DEBUG_MODE=true'}

      puts `gjslint -r js/ --exclude_directories="js/vendor,js/test" --exclude_files="js/app.min.js,js/bootstrap.min.js,js/mode.min.js"`
      `java -jar compiler-latest/compiler.jar --js js/bootstrap.js --compilation_level=ADVANCED_OPTIMIZATIONS #{debug_flag} --debug=true > js/bootstrap.min.js`
      `closure-library-20121212-r2367/closure/bin/build/closurebuilder.py --root=closure-library-20121212-r2367/ --root=js/ --namespace="ww.app" --output_mode=compiled --compiler_flags="--externs='externs/jquery-1.6.js'" --compiler_flags="--compilation_level=ADVANCED_OPTIMIZATIONS" --compiler_flags="#{debug_flag}" --compiler_flags="--debug=true" --compiler_jar=compiler-latest/compiler.jar --output_file=js/app.min.js`
      `closure-library-20121212-r2367/closure/bin/build/closurebuilder.py --root=closure-library-20121212-r2367/ --root=js/ --namespace="ww.mode" --output_mode=compiled --compiler_flags="--externs='externs/jquery-1.6.js'" --compiler_flags="--compilation_level=ADVANCED_OPTIMIZATIONS" --compiler_flags="#{debug_flag}" --compiler_flags="--debug=true" --compiler_jar=compiler-latest/compiler.jar --output_file=js/mode.min.js`
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
        name = File.basename(p, '.html')
        test_name = "#{name}_test"
        source = File.read(p)

        appendScripts = %Q{
          <script src="app/jsUnitCore.js"></script>
          <script src="app_test.js"></script>
          <script src="#{test_name}.js"></script>
        }

        source.gsub!("../js/", "../")
        source.sub!("</body>", "#{appendScripts}</body>")

        File.open("js/test/#{test_name}.html", 'w') do |f|
          f.write(source)
        end
      end

      true
    end
  end
end

guard 'jsunit' do
  watch(/^modes\/(.*)\.html/)
end

guard 'closure' do
  watch(/^js\/(.*)\.js/)
end