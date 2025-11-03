"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useToast } from '@/components/ui/use-toast'
import { HelpCircle, Mail, Phone, MessageSquare, FileText, CheckCircle, Loader2 } from 'lucide-react'

export default function HelpSupportPage() {
  const { toast } = useToast()
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!subject.trim() || !message.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields"
      })
      return
    }
    
    setSending(true)
    
    try {
      // Simulate sending a message
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Clear form
      setSubject('')
      setMessage('')
      
      toast({
        title: "Message sent",
        description: "Your message has been sent to the support team"
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again later."
      })
    } finally {
      setSending(false)
    }
  }
  
  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Help & Support</h1>
      </div>
      
      <Alert>
        <HelpCircle className="h-4 w-4" />
        <AlertTitle>Need assistance?</AlertTitle>
        <AlertDescription>
          Contact the website developer for any issues or questions about the admin panel.
        </AlertDescription>
      </Alert>
      
      <Tabs defaultValue="contact" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="docs">Documentation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="contact">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Send a Message
                </CardTitle>
                <CardDescription>
                  Send a message directly to the support team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSendMessage} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input 
                      id="subject" 
                      placeholder="Brief description of your issue"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Describe your issue in detail"
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    />
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleSendMessage} disabled={sending}>
                  {sending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Ways to reach our support team
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="font-medium">Email Support</h3>
                    <p className="text-sm text-muted-foreground">
                      <a href="mailto:support@ajwatrading.com" className="text-primary hover:underline">
                        support@ajwatrading.com
                      </a>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Response time: 24-48 hours
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="font-medium">Phone Support</h3>
                    <p className="text-sm text-muted-foreground">
                      <a href="tel:+1234567890" className="text-primary hover:underline">
                        +1 (234) 567-890
                      </a>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Available Mon-Fri, 9am-5pm JST
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MessageSquare className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="font-medium">Live Chat</h3>
                    <p className="text-sm text-muted-foreground">
                      Available through our developer portal
                    </p>
                    <Button variant="link" className="p-0 h-auto text-xs" onClick={() => window.open('https://developer.ajwatrading.com/chat', '_blank')}>
                      Open developer portal
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="faq">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Common questions and answers about the admin panel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How do I add a new machinery listing?</AccordionTrigger>
                  <AccordionContent>
                    Navigate to Content → Machinery Items in the sidebar, then click the "Add New" button. 
                    Fill in all required fields and upload images, then click "Save" to publish the listing.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger>How do I change my password?</AccordionTrigger>
                  <AccordionContent>
                    Go to Settings in the sidebar or click on your profile picture in the top right corner 
                    and select "Profile Settings". Navigate to the Security tab where you can change your password.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger>How do I update the website content?</AccordionTrigger>
                  <AccordionContent>
                    Go to Content → Page Content in the sidebar. Select the page you want to edit, 
                    make your changes in the content editor, and click "Save Changes" to publish your updates.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger>How do I add a new user to the admin panel?</AccordionTrigger>
                  <AccordionContent>
                    Navigate to User Management in the sidebar and click "Add New User". Fill in the user's 
                    details, assign a role (Admin, Editor, or Viewer), and click "Create User". The new user 
                    will receive an email with login instructions.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5">
                  <AccordionTrigger>How do I view website analytics?</AccordionTrigger>
                  <AccordionContent>
                    Go to Analytics in the sidebar. This page provides access to Google Analytics where you 
                    can view detailed statistics about website traffic, user behavior, and more.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-6">
              <p className="text-sm text-muted-foreground">
                Can't find what you're looking for? <Button variant="link" className="p-0 h-auto">Contact support</Button>
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="docs">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Documentation
              </CardTitle>
              <CardDescription>
                Guides and resources for using the admin panel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Getting Started Guide</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Learn the basics of navigating and using the admin panel
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => window.open('/docs/getting-started.pdf', '_blank')}>
                      View Guide
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Content Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Learn how to manage website content, pages, and media
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => window.open('/docs/content-management.pdf', '_blank')}>
                      View Guide
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">User Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Learn how to manage users, roles, and permissions
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => window.open('/docs/user-management.pdf', '_blank')}>
                      View Guide
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Machinery Listings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Learn how to add, edit, and manage machinery listings
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => window.open('/docs/machinery-listings.pdf', '_blank')}>
                      View Guide
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <h3 className="font-medium">Developer Resources</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Access technical documentation and developer resources for customizing the admin panel
                </p>
                <Button variant="secondary" onClick={() => window.open('https://developer.ajwatrading.com', '_blank')}>
                  Visit Developer Portal
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
