require "./compile"

task :lint do
  lint_js
end

task :compile do
  build_js
  build_css
end

task :logo do
  build_logo_js
end

task :test do
  create_test_for_all_modes
  build_js_test
end

task :default => :compile