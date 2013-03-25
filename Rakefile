def create_test_for_mode(p)
  name = File.basename(p, '.html')
  test_name = "#{name}_test"
  source = File.read(p)

  appendScripts = %Q{
    <script>
      var modeIsReady = false;

      window.onModeReady = function(mode) {
        modeIsReady = mode;
      };

      function whenModeIsReady(onReady) {
        if (modeIsReady) {
          onReady(modeIsReady);
        } else {
          setTimeout(function() {
            whenModeIsReady(onReady);
          }, 100);
        }
      }

      function setUpPage() {
        setUpPageStatus = 'running';

        whenModeIsReady(function(m) {
          mode = m;
          setUpPageStatus = 'complete';
        });
      }

      function tearDownPage() {
        mode = null;
      }
    </script>
    <script src="app/jsUnitCore.js"></script>
    <script src="app_test.js"></script>
    <script src="#{test_name}.js"></script>
  }

  source.gsub!("../js/", "../")
  source.gsub!("../css/", "../../css/")
  source.gsub!(".min.js", ".test.js")
  
  source.sub!("</body>", "#{appendScripts}</body>")

  File.open("js/test/#{test_name}.html", 'w') do |f|
    f.write(source)
  end
end

def create_test_for_core
  p = "index.html"
  name = File.basename(p, '.html')
  test_name = "#{name}_test"
  source = File.read(p)

  appendScripts = %Q{
    <script src="app/jsUnitCore.js"></script>
    <script src="app_test.js"></script>
    <script src="#{test_name}.js"></script>
  }

  source.gsub!("js/", "../")
  source.gsub!("css/", "../../css/")
  source.gsub!(".min.js", ".test.js")
  
  lines = source.split("\n")
  lines.delete_at(30)
  lines.delete_at(30)
  lines.delete_at(30)
  lines.delete_at(30)
  lines.delete_at(30)
  lines.delete_at(30)
  lines.delete_at(30)
  source = lines.join("\n")

  appendScripts = %Q{
    <script src="app/jsUnitCore.js"></script>
    <script src="app_test.js"></script>
    <script src="#{test_name}.js"></script>
  }
  source.sub!("</body>", "#{appendScripts}</body>")

  File.open("js/test/#{test_name}.html", 'w') do |f|
    f.write(source)
  end
end

def create_test_for_all_modes
  Dir["modes/*.html"].each do |p|
    create_test_for_mode(p)
  end

  create_test_for_core
end

def build_css
  `bundle exec compass compile --force`
end

def lint_js
  puts `gjslint -r js/ --exclude_directories="js/vendor,js/test" --exclude_files="js/app.min.js,js/bootstrap.min.js,js/mode.min.js,js/app.test.js,js/mode.test.js,js/namespace.js"`
end

def build_js
  debug_flag = %Q{--define='DEBUG_MODE=true'}

  `vendor/closure-library-20121212-r2367/closure/bin/build/closurebuilder.py --root=vendor/closure-library-20121212-r2367/ --root=js/ --namespace="ww.app" --output_mode=compiled --compiler_flags="--externs='vendor/externs/jquery-1.6.js'" --compiler_flags="--externs='vendor/externs/tuna.js'" --compiler_flags="--externs='vendor/externs/audio.js'" --compiler_flags="--externs='vendor/externs/Physics.js'" --compiler_flags="--externs='vendor/externs/modernizr.js'" --compiler_flags="--externs='vendor/externs/Tween.js'" --compiler_flags="--compilation_level=ADVANCED_OPTIMIZATIONS" --compiler_flags="#{debug_flag}" --compiler_flags="--debug=true" --compiler_flags="--define='goog.ENABLE_DEBUG_LOADER=false'" --compiler_flags="--define='goog.DEBUG=false'" --compiler_jar=vendor/compiler-latest/compiler.jar --output_file=js/app.min.js`
end

def build_js_test
  debug_flag = %Q{--define='DEBUG_MODE=true'}
    
  `vendor/closure-library-20121212-r2367/closure/bin/build/closurebuilder.py --root=vendor/closure-library-20121212-r2367/ --root=js/ --namespace="ww.app" --output_mode=compiled --compiler_flags="--externs='vendor/externs/jquery-1.6.js'" --compiler_flags="--externs='vendor/externs/tuna.js'" --compiler_flags="--externs='vendor/externs/audio.js'" --compiler_flags="--externs='vendor/externs/Physics.js'" --compiler_flags="--externs='vendor/externs/modernizr.js'" --compiler_flags="--externs='vendor/externs/Tween.js'" --compiler_flags="--compilation_level=SIMPLE_OPTIMIZATIONS" --compiler_flags="--formatting=PRETTY_PRINT" --compiler_flags="#{debug_flag}" --compiler_flags="--define='goog.ENABLE_DEBUG_LOADER=false'" --compiler_flags="--define='goog.DEBUG=false'" --compiler_jar=vendor/compiler-latest/compiler.jar --output_file=js/app.test.js`

  `jscoverage js js-instrumented --no-instrument="vendor" --no-instrument="test"`
end

task :lint do
  lint_js
end

task :compile do
  build_js
  build_css
end

task :test do
  create_test_for_all_modes
  build_js_test
end

task :default => :compile