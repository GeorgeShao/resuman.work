import React from 'react'
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { Auth } from '@aws-amplify/auth';

function DashboardPage() {
    return (
        <div>
            <AmplifySignOut />
        </div>
    )
}

export default withAuthenticator(DashboardPage);