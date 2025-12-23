/**
 * Design System Showcase Page
 * ============================
 * Interactive demonstration of all UI components
 */

'use client';

import React, { useState } from 'react';
import {
  Button,
  Input,
  Textarea,
  Checkbox,
  RadioGroup,
  Switch,
  Select,
  Badge,
  Avatar,
  AvatarGroup,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Alert,
  Skeleton,
  SkeletonCard,
  SkeletonText,
  Spinner,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Logo,
  IconHome,
  IconSearch,
  IconUser,
  IconSettings,
  IconHeart,
  IconStar,
  IconCheck,
  IconAlertCircle,
  Container,
  Grid,
  Stack,
  Section,
  Divider,
  Heading,
  VisuallyHidden,
} from '@/components/ui';

export default function DesignSystemPage() {
  const [selectValue, setSelectValue] = useState('');
  const [multiSelectValue, setMultiSelectValue] = useState<string[]>([]);
  const [radioValue, setRadioValue] = useState('option1');
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [switchOn, setSwitchOn] = useState(false);

  const selectOptions = [
    { value: 'option1', label: 'React' },
    { value: 'option2', label: 'Vue' },
    { value: 'option3', label: 'Angular' },
    { value: 'option4', label: 'Svelte', disabled: true },
    { value: 'option5', label: 'Next.js' },
  ];

  return (
    <div className="min-h-screen bg-secondary-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-4xl font-bold text-secondary-900 mb-4">
            Design System
          </h1>
          <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
            A comprehensive UI component library built with accessibility-first principles,
            WCAG 2.1 AA compliance, and modern design patterns.
          </p>
        </header>

        {/* Tabs for sections */}
        <Tabs defaultValue="buttons" variant="pills" className="mb-12">
          <TabList className="mb-8 justify-center flex-wrap">
            <Tab value="buttons">Buttons</Tab>
            <Tab value="forms">Forms</Tab>
            <Tab value="display">Display</Tab>
            <Tab value="feedback">Feedback</Tab>
            <Tab value="brand">Brand & Icons</Tab>
            <Tab value="layout">Layout</Tab>
          </TabList>

          {/* BUTTONS SECTION */}
          <TabPanel value="buttons">
            <section className="space-y-8">
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Button Variants</h2>
                  <p className="text-secondary-500 text-sm">
                    Different button styles for various use cases
                  </p>
                </CardHeader>
                <CardBody>
                  <div className="flex flex-wrap gap-4">
                    <Button variant="primary">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="danger">Danger</Button>
                    <Button variant="success">Success</Button>
                    <Button variant="link">Link</Button>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Button Sizes</h2>
                </CardHeader>
                <CardBody>
                  <div className="flex flex-wrap items-center gap-4">
                    <Button size="xs">Extra Small</Button>
                    <Button size="sm">Small</Button>
                    <Button size="md">Medium</Button>
                    <Button size="lg">Large</Button>
                    <Button size="xl">Extra Large</Button>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Button States</h2>
                </CardHeader>
                <CardBody>
                  <div className="flex flex-wrap items-center gap-4">
                    <Button isLoading>Loading</Button>
                    <Button disabled>Disabled</Button>
                    <Button leftIcon={<span>🚀</span>}>With Icon</Button>
                    <Button fullWidth>Full Width</Button>
                  </div>
                </CardBody>
              </Card>
            </section>
          </TabPanel>

          {/* FORMS SECTION */}
          <TabPanel value="forms">
            <section className="space-y-8">
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Input Fields</h2>
                </CardHeader>
                <CardBody className="space-y-6">
                  <Input
                    label="Email Address"
                    type="email"
                    helperText="We'll never share your email."
                  />
                  <Input
                    label="Password"
                    type="password"
                    required
                  />
                  <Input
                    label="With Error"
                    error="This field is required"
                  />
                  <Input
                    label="Disabled"
                    disabled
                  />
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Textarea</h2>
                </CardHeader>
                <CardBody>
                  <Textarea
                    label="Your Message"
                    helperText="Maximum 500 characters"
                    rows={4}
                  />
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Select Dropdown</h2>
                </CardHeader>
                <CardBody className="space-y-6">
                  <Select
                    label="Choose Framework"
                    options={selectOptions}
                    value={selectValue}
                    onChange={(v) => setSelectValue(v as string)}
                    searchable
                  />
                  <Select
                    label="Multiple Selection"
                    options={selectOptions}
                    value={multiSelectValue}
                    onChange={(v) => setMultiSelectValue(v as string[])}
                    multiple
                  />
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Checkboxes & Radios</h2>
                </CardHeader>
                <CardBody className="space-y-6">
                  <div className="space-y-3">
                    <Checkbox
                      label="Accept terms and conditions"
                      description="You agree to our Terms of Service and Privacy Policy."
                      checked={checkboxChecked}
                      onChange={(e) => setCheckboxChecked(e.target.checked)}
                    />
                    <Checkbox label="Subscribe to newsletter" />
                    <Checkbox label="Disabled option" disabled />
                  </div>

                  <hr className="border-secondary-200" />

                  <RadioGroup
                    name="example"
                    label="Select an option"
                    options={[
                      { value: 'option1', label: 'Option 1', description: 'Description for option 1' },
                      { value: 'option2', label: 'Option 2', description: 'Description for option 2' },
                      { value: 'option3', label: 'Option 3 (Disabled)', disabled: true },
                    ]}
                    value={radioValue}
                    onChange={setRadioValue}
                  />

                  <hr className="border-secondary-200" />

                  <div className="space-y-3">
                    <Switch
                      label="Enable notifications"
                      checked={switchOn}
                      onChange={(e) => setSwitchOn(e.target.checked)}
                    />
                    <Switch label="Dark mode" size="lg" />
                    <Switch label="Disabled switch" disabled />
                  </div>
                </CardBody>
              </Card>
            </section>
          </TabPanel>

          {/* DISPLAY SECTION */}
          <TabPanel value="display">
            <section className="space-y-8">
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Badges</h2>
                </CardHeader>
                <CardBody>
                  <div className="flex flex-wrap gap-3">
                    <Badge variant="default">Default</Badge>
                    <Badge variant="primary">Primary</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="success">Success</Badge>
                    <Badge variant="warning">Warning</Badge>
                    <Badge variant="error">Error</Badge>
                    <Badge variant="info">Info</Badge>
                    <Badge variant="outline">Outline</Badge>
                    <Badge variant="success" dot>With Dot</Badge>
                    <Badge variant="primary" onRemove={() => {}}>
                      Removable
                    </Badge>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Avatars</h2>
                </CardHeader>
                <CardBody className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Avatar size="xs" name="John Doe" />
                    <Avatar size="sm" name="Jane Smith" />
                    <Avatar size="md" name="Bob Wilson" />
                    <Avatar size="lg" name="Alice Brown" />
                    <Avatar size="xl" name="Charlie Davis" status="online" />
                    <Avatar size="2xl" name="Eve Miller" status="away" />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-secondary-700 mb-3">Avatar Group</p>
                    <AvatarGroup max={4}>
                      <Avatar name="User 1" />
                      <Avatar name="User 2" />
                      <Avatar name="User 3" />
                      <Avatar name="User 4" />
                      <Avatar name="User 5" />
                      <Avatar name="User 6" />
                    </AvatarGroup>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Cards</h2>
                </CardHeader>
                <CardBody>
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card shadow="md">
                      <CardBody>
                        <h3 className="font-semibold mb-2">Basic Card</h3>
                        <p className="text-secondary-600 text-sm">
                          A simple card with just body content.
                        </p>
                      </CardBody>
                    </Card>

                    <Card isInteractive>
                      <CardHeader>
                        <h3 className="font-semibold">Interactive Card</h3>
                      </CardHeader>
                      <CardBody>
                        <p className="text-secondary-600 text-sm">
                          Hover over this card to see the interactive effect.
                        </p>
                      </CardBody>
                      <CardFooter>
                        <Button size="sm">Action</Button>
                      </CardFooter>
                    </Card>
                  </div>
                </CardBody>
              </Card>
            </section>
          </TabPanel>

          {/* FEEDBACK SECTION */}
          <TabPanel value="feedback">
            <section className="space-y-8">
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Alerts</h2>
                </CardHeader>
                <CardBody className="space-y-4">
                  <Alert variant="info" title="Information">
                    This is an informational alert message.
                  </Alert>
                  <Alert variant="success" title="Success">
                    Your changes have been saved successfully.
                  </Alert>
                  <Alert variant="warning" title="Warning" dismissible>
                    Please review your settings before continuing.
                  </Alert>
                  <Alert variant="error" title="Error" dismissible>
                    An error occurred while processing your request.
                  </Alert>
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Loading States</h2>
                </CardHeader>
                <CardBody className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Spinner size="sm" />
                    <Spinner size="md" />
                    <Spinner size="lg" />
                    <Spinner size="xl" color="secondary" />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-secondary-700 mb-3">Skeleton Loading</p>
                    <div className="space-y-4">
                      <SkeletonText lines={3} />
                      <div className="flex gap-2">
                        <Skeleton className="h-10 w-24 rounded-lg" />
                        <Skeleton className="h-10 w-24 rounded-lg" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-secondary-700 mb-3">Skeleton Card</p>
                    <SkeletonCard />
                  </div>
                </CardBody>
              </Card>
            </section>
          </TabPanel>

          {/* BRAND & ICONS SECTION */}
          <TabPanel value="brand">
            <section className="space-y-8">
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Logo</h2>
                  <p className="text-secondary-500 text-sm">
                    Brand logo in different variants and sizes
                  </p>
                </CardHeader>
                <CardBody>
                  <div className="space-y-8">
                    <div>
                      <p className="text-sm font-medium text-secondary-700 mb-4">Full Logo</p>
                      <div className="flex flex-wrap items-center gap-8">
                        <Logo size="sm" />
                        <Logo size="md" />
                        <Logo size="lg" />
                      </div>
                    </div>
                    
                    <Divider />
                    
                    <div>
                      <p className="text-sm font-medium text-secondary-700 mb-4">Icon Only</p>
                      <div className="flex flex-wrap items-center gap-4">
                        <Logo variant="icon" size="sm" />
                        <Logo variant="icon" size="md" />
                        <Logo variant="icon" size="lg" />
                        <Logo variant="icon" size="xl" />
                      </div>
                    </div>
                    
                    <Divider />
                    
                    <div>
                      <p className="text-sm font-medium text-secondary-700 mb-4">On Dark Background</p>
                      <div className="bg-secondary-900 p-6 rounded-lg flex items-center gap-8">
                        <Logo theme="white" />
                        <Logo variant="icon" theme="white" size="lg" />
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Icons</h2>
                  <p className="text-secondary-500 text-sm">
                    SVG icons with consistent styling
                  </p>
                </CardHeader>
                <CardBody>
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
                    {[
                      { icon: IconHome, name: 'Home' },
                      { icon: IconSearch, name: 'Search' },
                      { icon: IconUser, name: 'User' },
                      { icon: IconSettings, name: 'Settings' },
                      { icon: IconHeart, name: 'Heart' },
                      { icon: IconStar, name: 'Star' },
                      { icon: IconCheck, name: 'Check' },
                      { icon: IconAlertCircle, name: 'Alert' },
                    ].map(({ icon: Icon, name }) => (
                      <div 
                        key={name}
                        className="flex flex-col items-center p-3 rounded-lg hover:bg-secondary-100 transition-colors"
                      >
                        <Icon size="lg" className="text-secondary-600" />
                        <VisuallyHidden>{name}</VisuallyHidden>
                        <span className="text-xs text-secondary-500 mt-2">{name}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Divider />
                  
                  <div>
                    <p className="text-sm font-medium text-secondary-700 mb-4">Icon Sizes</p>
                    <div className="flex items-end gap-4">
                      <div className="text-center">
                        <IconHeart size="xs" className="text-error-500" />
                        <p className="text-xs text-secondary-500 mt-1">xs</p>
                      </div>
                      <div className="text-center">
                        <IconHeart size="sm" className="text-error-500" />
                        <p className="text-xs text-secondary-500 mt-1">sm</p>
                      </div>
                      <div className="text-center">
                        <IconHeart size="md" className="text-error-500" />
                        <p className="text-xs text-secondary-500 mt-1">md</p>
                      </div>
                      <div className="text-center">
                        <IconHeart size="lg" className="text-error-500" />
                        <p className="text-xs text-secondary-500 mt-1">lg</p>
                      </div>
                      <div className="text-center">
                        <IconHeart size="xl" className="text-error-500" />
                        <p className="text-xs text-secondary-500 mt-1">xl</p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </section>
          </TabPanel>

          {/* LAYOUT SECTION */}
          <TabPanel value="layout">
            <section className="space-y-8">
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Headings</h2>
                  <p className="text-secondary-500 text-sm">
                    Semantic headings with consistent typography
                  </p>
                </CardHeader>
                <CardBody>
                  <Stack gap={4}>
                    <Heading level={1}>Heading Level 1</Heading>
                    <Heading level={2}>Heading Level 2</Heading>
                    <Heading level={3}>Heading Level 3</Heading>
                    <Heading level={4}>Heading Level 4</Heading>
                    <Heading level={5}>Heading Level 5</Heading>
                    <Heading level={6}>Heading Level 6</Heading>
                  </Stack>
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Grid System</h2>
                  <p className="text-secondary-500 text-sm">
                    Responsive grid with configurable columns
                  </p>
                </CardHeader>
                <CardBody>
                  <div className="space-y-6">
                    <div>
                      <p className="text-sm font-medium text-secondary-700 mb-3">4-column grid (responsive)</p>
                      <Grid cols={{ default: 1, sm: 2, md: 3, lg: 4 }} gap={4}>
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="bg-primary-100 p-4 rounded-lg text-center text-primary-700 font-medium">
                            Item {i}
                          </div>
                        ))}
                      </Grid>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-secondary-700 mb-3">3-column grid</p>
                      <Grid cols={{ default: 1, md: 3 }} gap={6}>
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="bg-secondary-100 p-6 rounded-lg text-center text-secondary-700">
                            Column {i}
                          </div>
                        ))}
                      </Grid>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Stack</h2>
                  <p className="text-secondary-500 text-sm">
                    Flexible layout for horizontal and vertical stacking
                  </p>
                </CardHeader>
                <CardBody>
                  <div className="space-y-6">
                    <div>
                      <p className="text-sm font-medium text-secondary-700 mb-3">Horizontal Stack</p>
                      <Stack flex-direction="horizontal" gap={4} align-items="center">
                        <div className="bg-success-100 p-4 rounded-lg text-success-700">Item 1</div>
                        <div className="bg-success-100 p-6 rounded-lg text-success-700">Item 2</div>
                        <div className="bg-success-100 p-3 rounded-lg text-success-700">Item 3</div>
                      </Stack>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-secondary-700 mb-3">Vertical Stack</p>
                      <Stack flex-direction="vertical" gap={3}>
                        <div className="bg-warning-100 p-3 rounded-lg text-warning-700">Item 1</div>
                        <div className="bg-warning-100 p-3 rounded-lg text-warning-700">Item 2</div>
                        <div className="bg-warning-100 p-3 rounded-lg text-warning-700">Item 3</div>
                      </Stack>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Container</h2>
                  <p className="text-secondary-500 text-sm">
                    Centered container with responsive max-width
                  </p>
                </CardHeader>
                <CardBody>
                  <div className="bg-secondary-100 p-4 rounded-lg">
                    <Container size="md" className="bg-white p-4 rounded border border-dashed border-secondary-300">
                      <p className="text-center text-secondary-600">
                        This is a medium-sized container (max-width: 768px)
                      </p>
                    </Container>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Section</h2>
                  <p className="text-secondary-500 text-sm">
                    Page sections with consistent spacing and backgrounds
                  </p>
                </CardHeader>
                <CardBody className="space-y-4">
                  <Section background="default" padding="sm" className="rounded-lg border">
                    <p className="text-center">Default Background</p>
                  </Section>
                  <Section background="muted" padding="sm" className="rounded-lg">
                    <p className="text-center">Muted Background</p>
                  </Section>
                  <Section background="accent" padding="sm" className="rounded-lg">
                    <p className="text-center">Accent Background</p>
                  </Section>
                  <Section background="dark" padding="sm" className="rounded-lg">
                    <p className="text-center">Dark Background</p>
                  </Section>
                </CardBody>
              </Card>
            </section>
          </TabPanel>
        </Tabs>

        {/* Footer */}
        <footer className="text-center mt-16 pt-8 border-t border-secondary-200">
          <p className="text-secondary-500 text-sm">
            Built with ❤️ using React, TypeScript, and Tailwind CSS
          </p>
          <p className="text-secondary-400 text-xs mt-2">
            WCAG 2.1 AA Compliant • Accessibility First • Mobile Responsive
          </p>
        </footer>
      </div>
    </div>
  );
}
