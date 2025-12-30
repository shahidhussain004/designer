import { Card, Divider, Flex, Text } from '@/components/green'
import { PageLayout } from '@/components/layout'

export const metadata = {
  title: 'Privacy Policy',
}

export default function PrivacyPage() {
  return (
    <PageLayout>
      <Flex flex-direction="column" gap="l" padding="l" style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div>
            <Text font-size="heading-l">Privacy Policy</Text>
            <Text font-size="body-s" color="neutral-02">
            Last updated: January 2024
          </Text>
        </div>

        <Card padding="l">
          <Flex flex-direction="column" gap="m">
            <div>
                <Text font-size="heading-s">1. Information We Collect</Text>
                <Text font-size="body-l">
                We collect information you provide directly to us when you create an account, update your profile, or communicate with other users. This includes your name, email address, profile information, and payment details.
              </Text>
            </div>

            <Divider />

            <div>
                <Text font-size="heading-s">2. How We Use Your Information</Text>
                <Text font-size="body-l">
                We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, and communicate with you about products, services, and events.
              </Text>
            </div>

            <Divider />

            <div>
                <Text font-size="heading-s">3. Information Sharing</Text>
                <Text font-size="body-l">
                We do not share your personal information with third parties except as described in this policy. We may share information with service providers who perform services on our behalf, such as payment processing and data analytics.
              </Text>
            </div>

            <Divider />

            <div>
                <Text font-size="heading-s">4. Data Security</Text>
                <Text font-size="body-l">
                We take reasonable measures to help protect your personal information from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction. However, no security system is impenetrable.
              </Text>
            </div>

            <Divider />

            <div>
                <Text font-size="heading-s">5. Cookies and Tracking</Text>
                <Text font-size="body-l">
                We use cookies and similar tracking technologies to collect information about your browsing activities. You can control cookies through your browser settings.
              </Text>
            </div>

            <Divider />

            <div>
                <Text font-size="heading-s">6. Your Rights</Text>
                <Text font-size="body-l">
                You have the right to access, update, or delete your personal information at any time through your account settings. You may also request a copy of your data or ask us to delete your account.
              </Text>
            </div>

            <Divider />

            <div>
                <Text font-size="heading-s">7. Children&apos;s Privacy</Text>
                <Text font-size="body-l">
                Our services are not directed to children under 13, and we do not knowingly collect personal information from children under 13.
              </Text>
            </div>

            <Divider />

            <div>
                <Text font-size="heading-s">8. Changes to This Policy</Text>
                <Text font-size="body-l">
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
              </Text>
            </div>

            <Divider />

            <div>
                <Text font-size="body-s" color="neutral-02">
                For questions about this privacy policy, please contact us at privacy@designer-marketplace.com
              </Text>
            </div>
          </Flex>
        </Card>
      </Flex>
    </PageLayout>
  )
}
