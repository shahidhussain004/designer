import { Card, Flex, Text } from '@/components/green';
import { PageLayout } from '@/components/ui';
import ContactForm from './ContactForm';

export default function ContactPage() {
  return (
    <PageLayout>
      <Flex flex-direction="column" gap="l" padding="l" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div>
          <Text font-size="heading-l">Contact Us</Text>
          <Text font-size="body-l" color="neutral-02">
            Get in touch with us! We would love to hear from you.
          </Text>
        </div>

        <Card padding="l">
          <ContactForm />
        </Card>

        <Card padding="m">
          <Flex flex-direction="column" gap="m">
            <Text font-size="heading-5">Other Ways to Reach Us</Text>
            <Text font-size="body-m">
              📧 Email: support@designer-marketplace.com
            </Text>
            <Text font-size="body-m">
              📞 Phone: +1 (555) 123-4567
            </Text>
            <Text font-size="body-m">
              🏢 Address: 123 Design Street, Creative City, CA 94000
            </Text>
          </Flex>
        </Card>
      </Flex>
    </PageLayout>
  )
}
