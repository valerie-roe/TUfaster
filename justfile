dev:
    @just _wxt

autoimports:
    @just _wxt prepare

_wxt *args:
    npx wxt {{ args }}
