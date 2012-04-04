# Umbrella Makefile.

MAKEDIR := make
include $(MAKEDIR)/Makefile.common

PRIMARY := lib
BUILDDIR := build

##################################################
# self configuration (do not touch)

export MAKEDIR
export BUILDDIR

##################################################
# targets

.PHONY : all debug release doc test

all :
	@$(call defer,$(MAKEDIR)/Makefile.$(PRIMARY))

debug :
	@$(call defer,$(MAKEDIR)/Makefile.$(PRIMARY))

release :
	@$(call defer,$(MAKEDIR)/Makefile.$(PRIMARY))

doc :
	@$(call defer,$(MAKEDIR)/Makefile.$(PRIMARY))

test :
	@./test/run --skip-passing

##################################################
# cleaning

.PHONY : clean clean-obj clean-exe clean-doc

clean :
	@$(MAKE) -f $(MAKEDIR)/Makefile.$(PRIMARY) clean-exe
	-rm -rf $(BUILDDIR)

clean-obj :
	@$(call defer,$(MAKEDIR)/Makefile.$(PRIMARY))

clean-exe :
	@$(call defer,$(MAKEDIR)/Makefile.$(PRIMARY))

clean-doc :
	@$(call defer,$(MAKEDIR)/Makefile.$(PRIMARY))

