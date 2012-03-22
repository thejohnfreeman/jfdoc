# Umbrella Makefile.

MAKEDIR := make
export MAKEDIR
include $(MAKEDIR)/Makefile.common

##################################################
# targets

.PHONY : all debug release plus syntax doc 

all :
	@$(call defer,$(MAKEDIR)/Makefile.lib)

debug :
	@$(call defer,$(MAKEDIR)/Makefile.lib)

release :
	@$(call defer,$(MAKEDIR)/Makefile.lib)

plus :
	@$(call defer,$(MAKEDIR)/Makefile.lib)

syntax :
	@$(call defer,$(MAKEDIR)/Makefile.lib)

doc :
	@$(call defer,$(MAKEDIR)/Makefile.lib)

##################################################
# cleaning

.PHONY : clean clean-obj clean-exe clean-doc

clean : clean-obj clean-exe clean-doc
	-rm -rf build

clean-obj :
	@$(call defer,$(MAKEDIR)/Makefile.lib)

clean-exe :
	@$(call defer,$(MAKEDIR)/Makefile.lib)

clean-doc :
	@$(call defer,$(MAKEDIR)/Makefile.lib)

