import { Card, Divider, Flex, Text } from '@/components/green'
import { PageLayout } from '@/components/ui'

export const metadata = {
  title: 'Terms of Service',
}

export default function TermsPage() {
  return (
    <PageLayout>
      <Flex flex-direction="column" gap="l" padding="l" style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div>
              <Text font-size="heading-l">Terms of Service</Text>
              <Text font-size="body-s" color="neutral-02">
            Last updated: January 2024
          </Text>
        </div>

        <Card padding="l">
          <Flex flex-direction="column" gap="m">
            <div>
              <Text font-size="heading-4">1. Acceptance of Terms</Text>
              <Text font-size="body-m">
                 By using our services, you agree to these terms.
              </Text>
            </div>

            <Divider />

            <div>
              <Text font-size="heading-4">2. Use License</Text>
              <Text font-size="body-m">
                 Permission is granted to temporarily download one copy of the materials...
              </Text>
            </div>

            <Divider />

            <div>
              <Text font-size="heading-4">3. User Accounts</Text>
              <Text font-size="body-m">
                 You are responsible for maintaining the confidentiality of your account.
              </Text>
            </div>

            <Divider />

            <div>
              <Text font-size="heading-4">4. Freelancer and Client Responsibilities</Text>
              <Text font-size="body-m">
                 Freelancers and clients must adhere to fair use policies.
              </Text>
            </div>

            <Divider />

            <div>
              <Text font-size="heading-4">5. Payment Terms</Text>
              <Text font-size="body-m">
                 Payments are processed through our payment provider and are subject to fees.
              </Text>
            </div>

            <Divider />

            <div>
              <Text font-size="heading-4">6. Dispute Resolution</Text>
              <Text font-size="body-m">
                 Disputes will be handled through our internal mediation process.
              </Text>
            </div>

            <Divider />

            <div>
              <Text font-size="heading-4">7. Termination</Text>
              <Text font-size="body-m">
                 We may suspend or terminate accounts that violate these terms.
              </Text>
            </div>

            <Divider />

            <div>
              <Text font-size="heading-4">8. Changes to Terms</Text>
              <Text font-size="body-m">
                 We reserve the right to update these terms; changes will be posted here.
              </Text>
            </div>

            <Divider />

            <div>
              <Text font-size="body-s" color="neutral-02">
                For questions about these terms, please contact us at legal@designer-marketplace.com
              </Text>
            </div>
          </Flex>
        </Card>
      </Flex>
    </PageLayout>
  )
}
