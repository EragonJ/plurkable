#!/usr/bin/perl
use strict;
use CGI;
use WWW::Mechanize;

# I dont like 500 internal error.
print "Content-type: text/xml\n\n";

# CGI 
my $cgi = CGI->new();
my %params = $cgi->Vars();

# Mechanize
my $mech = WWW::Mechanize->new;
$mech->get('http://www.plurk.com/user/'.$params{account}.'.xml');

print $mech->content;
