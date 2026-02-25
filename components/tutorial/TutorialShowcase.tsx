"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TutorialTriggerButton } from "./TutorialTriggerButton";
import { TutorialHelpMenu } from "./TutorialHelpMenu";
import { TutorialQuickAccess } from "./TutorialQuickAccess";

export function TutorialShowcase() {
  return (
    <div className="space-y-8 p-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Tutorial Components Showcase</h1>
        <p className="text-muted-foreground">
          Various ways to trigger and access the interactive tutorial
        </p>
      </div>

      {/* Tutorial Trigger Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Tutorial Trigger Buttons</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Minimal Style */}
          <div className="space-y-2">
            <h3 className="font-semibold">Minimal Style</h3>
            <div className="flex items-center gap-4 flex-wrap">
              <TutorialTriggerButton style="minimal" variant="default" />
              <TutorialTriggerButton style="minimal" variant="outline" />
              <TutorialTriggerButton style="minimal" variant="ghost" />
              <TutorialTriggerButton style="minimal" showText={false} />
            </div>
          </div>

          {/* Badge Style */}
          <div className="space-y-2">
            <h3 className="font-semibold">Badge Style</h3>
            <div className="flex items-center gap-4 flex-wrap">
              <TutorialTriggerButton style="badge" />
              <TutorialTriggerButton style="badge" showText={false} />
              <TutorialTriggerButton style="badge" icon="rocket" />
            </div>
          </div>

          {/* Floating Style */}
          <div className="space-y-2">
            <h3 className="font-semibold">Floating Style</h3>
            <div className="flex items-center gap-4 flex-wrap">
              <TutorialTriggerButton style="floating" position="relative" />
              <TutorialTriggerButton style="floating" position="relative" pulse={true} />
              <TutorialTriggerButton style="floating" position="relative" glow={true} />
            </div>
          </div>

          {/* Prominent Style */}
          <div className="space-y-2">
            <h3 className="font-semibold">Prominent Style</h3>
            <div className="flex items-center gap-4 flex-wrap">
              <TutorialTriggerButton style="prominent" />
              <TutorialTriggerButton style="prominent" pulse={true} />
              <TutorialTriggerButton style="prominent" glow={true} />
            </div>
          </div>

          {/* Different Icons */}
          <div className="space-y-2">
            <h3 className="font-semibold">Different Icons</h3>
            <div className="flex items-center gap-4 flex-wrap">
              <TutorialTriggerButton icon="lightbulb" />
              <TutorialTriggerButton icon="play" />
              <TutorialTriggerButton icon="help" />
              <TutorialTriggerButton icon="rocket" />
              <TutorialTriggerButton icon="sparkles" />
              <TutorialTriggerButton icon="book" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Help Menus */}
      <Card>
        <CardHeader>
          <CardTitle>Help Menus</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-semibold">Dropdown Menu</h3>
            <div className="flex items-center gap-4">
              <TutorialHelpMenu variant="dropdown" trigger="button" />
              <TutorialHelpMenu variant="dropdown" trigger="icon" />
              <TutorialHelpMenu variant="dropdown" trigger="text" />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Popup Menu</h3>
            <div className="flex items-center gap-4">
              <TutorialHelpMenu variant="popup" trigger="button" />
              <TutorialHelpMenu variant="popup" trigger="icon" />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Sidebar Menu</h3>
            <div className="max-w-xs">
              <TutorialHelpMenu variant="sidebar" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Access Components */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Access Components</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-semibold">Card Variant</h3>
            <TutorialQuickAccess variant="card" />
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Banner Variant</h3>
            <TutorialQuickAccess variant="banner" />
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Compact Variant</h3>
            <TutorialQuickAccess variant="compact" />
          </div>
        </CardContent>
      </Card>

      {/* Usage Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Examples</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold">Code Examples</h3>
            <div className="bg-muted p-4 rounded-lg text-sm font-mono space-y-2">
              <div>
                <Badge variant="secondary" className="mb-2">Basic Button</Badge>
                <div className="text-muted-foreground">
                  {`<TutorialTriggerButton style="minimal" />`}
                </div>
              </div>
              
              <div>
                <Badge variant="secondary" className="mb-2">Floating Button</Badge>
                <div className="text-muted-foreground">
                  {`<TutorialTriggerButton 
  style="floating" 
  position="fixed" 
  location="bottom-right" 
  pulse={true} 
/>`}
                </div>
              </div>
              
              <div>
                <Badge variant="secondary" className="mb-2">Help Menu</Badge>
                <div className="text-muted-foreground">
                  {`<TutorialHelpMenu variant="dropdown" trigger="button" />`}
                </div>
              </div>
              
              <div>
                <Badge variant="secondary" className="mb-2">Quick Access</Badge>
                <div className="text-muted-foreground">
                  {`<TutorialQuickAccess variant="banner" dismissible={true} />`}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fixed Position Examples */}
      <div className="fixed bottom-4 right-4 space-y-2">
        <TutorialTriggerButton 
          style="floating" 
          position="fixed" 
          location="bottom-right"
          pulse={true}
          glow={true}
        />
      </div>
    </div>
  );
}