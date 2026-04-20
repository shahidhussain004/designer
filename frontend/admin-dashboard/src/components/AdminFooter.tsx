import { Flex, Text } from './green'

export default function AdminFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800 mt-12">
      <Flex flex-direction="column" className="max-w-7xl mx-auto" padding="l">
        {/* Top Section */}
        <Flex justify-content="space-between" align-items="flex-start" gap="l" className="mb-8 pb-8 border-b border-gray-800">
          {/* Company Info */}
          <div className="flex-1">
            <Text className="text-white font-bold text-lg mb-2">Designer Marketplace</Text>
            <Text className="text-sm">Professional platform for designers and companies to collaborate seamlessly.</Text>
          </div>

          {/* Quick Links */}
          <div className="ml-4">
            <Text className="text-white font-semibold mb-4">Quick Links</Text>
            <Flex flex-direction="column" gap="s" className="text-sm">
              <a href="#" className="hover:text-white transition">Dashboard</a>
              <a href="#" className="hover:text-white transition">Documentation</a>
              <a href="#" className="hover:text-white transition">Support</a>
            </Flex>
          </div>

          {/* Resources */}
          <div className="ml-4">
            <Text className="text-white font-semibold mb-4">Resources</Text>
            <Flex flex-direction="column" gap="s" className="text-sm">
              <a href="#" className="hover:text-white transition">API Docs</a>
              <a href="#" className="hover:text-white transition">Security</a>
              <a href="#" className="hover:text-white transition">Status</a>
            </Flex>
          </div>

          {/* Legal */}
          <div className="ml-4">
            <Text className="text-white font-semibold mb-4">Legal</Text>
            <Flex flex-direction="column" gap="s" className="text-sm">
              <a href="#" className="hover:text-white transition">Privacy</a>
              <a href="#" className="hover:text-white transition">Terms</a>
              <a href="#" className="hover:text-white transition">Contact</a>
            </Flex>
          </div>
        </Flex>

        {/* Bottom Section */}
        <Flex justify-content="space-between" align-items="center" className="text-sm">
          <Text>© {currentYear} Designer Marketplace. All rights reserved.</Text>
          <Text>v1.0.0</Text>
        </Flex>
      </Flex>
    </footer>
  )
}
