# Umbrella Makefile.

MAKEDIR := make
export MAKEDIR
include $(MAKEDIR)/Makefile.common

##################################################
# targets

.PHONY : all debug release doc test

all :
	@$(call defer,$(MAKEDIR)/Makefile.lib)

debug :
	@$(call defer,$(MAKEDIR)/Makefile.lib)

release :
	@$(call defer,$(MAKEDIR)/Makefile.lib)

doc :
	-ln -s bin/jfdoc
	@$(call defer,$(MAKEDIR)/Makefile.lib)

test :
	@./test/run --skip-passing

##################################################
# cleaning

.PHONY : clean clean-obj clean-exe clean-doc

clean : clean-obj clean-exe clean-doc
	-rm -rf build

clean-obj :
	@$(call defer,$(MAKEDIR)/Makefile.lib)

clean-exe :
	@$(call defer,$(MAKEDIR)/Makefile.lib)
	-rm -f jfdoc

clean-doc :
	@$(call defer,$(MAKEDIR)/Makefile.lib)

