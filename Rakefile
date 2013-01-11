require "./compile"

task :compile do
  create_test_for_all_modes
  build_js
  build_css
end

task :default => :compile