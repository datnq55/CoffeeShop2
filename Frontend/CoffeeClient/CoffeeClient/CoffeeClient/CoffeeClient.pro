#-------------------------------------------------
#
# Project created by QtCreator 2016-11-16T21:37:57
#
#-------------------------------------------------

QT       += core gui

greaterThan(QT_MAJOR_VERSION, 4): QT += widgets

TARGET = CoffeeClient
TEMPLATE = app


SOURCES += main.cpp\
        mainwindow.cpp \
    entities/table.cpp

HEADERS  += mainwindow.h \
    entities/table.h

FORMS    += mainwindow.ui
