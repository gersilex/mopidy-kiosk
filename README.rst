****************************
Mopidy-Kiosk
****************************

.. image:: https://img.shields.io/pypi/v/Mopidy-Kiosk.svg?style=flat
    :target: https://pypi.python.org/pypi/Mopidy-Kiosk/
    :alt: Latest PyPI version

.. image:: https://img.shields.io/travis/gersilex/mopidy-kiosk/master.svg?style=flat
    :target: https://travis-ci.org/gersilex/mopidy-kiosk
    :alt: Travis CI build status

.. image:: https://img.shields.io/coveralls/gersilex/mopidy-kiosk/master.svg?style=flat
   :target: https://coveralls.io/r/gersilex/mopidy-kiosk
   :alt: Test coverage

.. image:: https://codebeat.co/badges/6b3676c5-9247-4d07-b940-d85f95e4bce1
   :target: https://codebeat.co/projects/github-com-gersilex-mopidy-kiosk-develop
   :alt: codebeat badge

.. image:: https://bettercodehub.com/edge/badge/gersilex/mopidy-kiosk?branch=develop
   :alt: BCH compliance

Mopidy web frontend for public and social playlist control


Description
===========

Mopidy-Kiosk is a single-user (but multi-device) web frontend for Mopidy suitable for
public places like clubs and parties that allows guests to take control over the playlist
queue while hiding dangerous controls that could stop or impact the music experience.

Mopidy-Kiosk is intended to run on a single, publicly used tablet or PC that is
shared between all users or guests. There is no user or admin login. Administrators
should use one of the many existing Mopidy frontends to interact with the Mopidy server.

There are configuration options to keep the playlist "fair" and allow different users
to queue different music. For example, the playlist length can be limited to prevent
single users filling up the playlist. On the other hand maximum playtime of songs or
genres can be set to keep a balance between different music taste.

Installation
============

Install by running::

    pip install Mopidy-Kiosk


Configuration
=============

Before starting Mopidy, you must add configuration for
Mopidy-Kiosk to your Mopidy configuration file::

    [kiosk]
    # TODO: Add example of extension config


Project resources
=================

- `Source code <https://github.com/gersilex/mopidy-kiosk>`_
- `Issue tracker <https://github.com/gersilex/mopidy-kiosk/issues>`_


Credits
=======

- Original author: `Leroy Förster <https://github.com/gersilex>`__
- Current maintainer: `Leroy Förster <https://github.com/gersilex>`__
- `Contributors <https://github.com/gersilex/mopidy-kiosk/graphs/contributors>`_


Changelog
=========

v0.1.0 (UNRELEASED)
----------------------------------------

- Initial release.
