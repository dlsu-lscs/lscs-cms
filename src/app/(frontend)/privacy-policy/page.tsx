import React from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Shield, Mail, Lock, User, Database, FileText } from 'lucide-react'

export default function PrivacyPolicy() {
  const lastUpdated = 'October 31, 2025'
  const appName = 'La Salle Computer Society'
  const websiteName = 'LSCS CMS'
  const contactEmail = 'rnd@dlsu-lscs.org'

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <main className="flex flex-col">
          <div className="mb-4">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-4 py-2 rounded bg-slate-800 text-slate-200 hover:bg-slate-700 transition"
            >
              <ArrowLeft className="h-4 w-4" />
              Return
            </Link>
          </div>
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Shield className="h-16 w-16 text-yellow-400" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-3">Privacy Policy</h1>
            <p className="text-slate-400">Last updated: {lastUpdated}</p>
          </div>

          {/* Introduction */}
          <Card className="mb-6 bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <FileText className="h-5 w-5 text-yellow-400" />
                1. Introduction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 leading-relaxed">
                {appName} operates {websiteName}. This Privacy Policy explains how we collect, use,
                and protect your information when you use Google Sign-In in our application.
              </p>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <Card className="mb-6 bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Database className="h-5 w-5 text-yellow-400" />
                2. Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-300 leading-relaxed">
                When you sign in using Google, we may collect the following information from your
                Google account (depending on your permissions):
              </p>
              <div className="bg-yellow-950/50 border border-yellow-800/50 rounded-lg p-4">
                <ul className="space-y-2 text-slate-300">
                  <li className="flex items-center gap-3">
                    <User className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                    <span>Your name</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                    <span>Your email address</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <User className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                    <span>Your profile picture</span>
                  </li>
                </ul>
              </div>
              <div className="bg-green-950/50 border border-green-800/50 rounded-lg p-4">
                <p className="text-green-300 font-medium">
                  ✓ We do not collect or access your password or any other private Google data.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Your Information */}
          <Card className="mb-6 bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Lock className="h-5 w-5 text-yellow-400" />
                3. How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 leading-relaxed mb-3">
                We use your Google account information solely to:
              </p>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-1 font-bold">•</span>
                  <span>Authenticate you and allow you to log in securely</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-1 font-bold">•</span>
                  <span>Display your name and profile picture in the app</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-1 font-bold">•</span>
                  <span>Communicate with you regarding your account (if applicable)</span>
                </li>
              </ul>
              <Separator className="my-4 bg-slate-800" />
              <div className="bg-amber-950/50 border border-amber-800/50 rounded-lg p-4">
                <p className="text-amber-300 font-semibold">
                  We do not sell, rent, or share your personal data with third parties.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Data Storage and Security */}
          <Card className="mb-6 bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Shield className="h-5 w-5 text-yellow-400" />
                4. Data Storage and Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-slate-300 leading-relaxed">
                Your data is stored securely in our servers and protected using industry-standard
                encryption and access controls.
              </p>
              <p className="text-slate-300 leading-relaxed">
                We take reasonable measures to protect your information from unauthorized access or
                disclosure.
              </p>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card className="mb-6 bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">5. Your Rights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 leading-relaxed">
                You may request deletion of your account or data at any time by contacting us at{' '}
                <a
                  href={`mailto:${contactEmail}`}
                  className="text-yellow-400 hover:text-yellow-300 font-medium underline"
                >
                  {contactEmail}
                </a>
                .
              </p>
            </CardContent>
          </Card>

          {/* Changes to This Policy */}
          <Card className="mb-6 bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">6. Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 leading-relaxed">
                We may update this Privacy Policy from time to time. Any changes will be posted on
                this page with an updated date.
              </p>
            </CardContent>
          </Card>

          {/* Contact Us */}
          <Card className="mb-6 bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Mail className="h-5 w-5 text-yellow-400" />
                7. Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 leading-relaxed mb-4">
                If you have any questions or concerns about this Privacy Policy, contact us at:
              </p>
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <div className="flex items-center gap-2 text-slate-300">
                  <Mail className="h-5 w-5 text-yellow-400" />
                  <a
                    href={`mailto:${contactEmail}`}
                    className="text-yellow-400 hover:text-yellow-300 font-medium underline"
                  >
                    {contactEmail}
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>

        {/* Footer */}
        <footer className="text-center text-sm text-slate-500 -mb-4">
          <p>© 2025 {appName}. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}
