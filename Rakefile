require "./compile"

task :compile do
  build_js
  build_css
end

task :test do
  create_test_for_all_modes
  build_js_test
end

task :default => :compile