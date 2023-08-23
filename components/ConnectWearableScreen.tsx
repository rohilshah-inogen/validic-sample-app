import React, { useEffect, useState } from 'react'
import { Button, Platform, StyleSheet, Text, View } from 'react-native';
import axios from 'axios';
import Config from 'react-native-config';
import { ValidicSession, ValidicSessionEvents } from 'react-native-validic-session'
import {ValidicHealthKit, SampleTypes} from 'react-native-validic-aggregator-ios'

const validic = axios.create({ baseURL: Config.VALIDIC_API_URL })
const marketplace = axios.create({ baseURL: Config.MARKETPLACE })

const ConnectWearableScreen = (): JSX.Element => {
    const [marketplaceToken, setMarketplaceToken] = useState<string>('');
    const [marketplaceData, setMarketplaceData] = useState<object>({});
    const [testState, setTestState] = useState<number>(0);

    useEffect(() => {
        initializeMarketplace()
    }, [])

    useEffect(() => {
        if (marketplaceToken !== '') {
            getMarketplaceJSON().then((response) => {
                setMarketplaceData(response.data)
            }).catch((error) => {
                console.log(error)
            })
        }
    }, [marketplaceToken])

    async function getUserProfile(): Promise<object> {
        const url = `/organizations/${Config.ORG_ID as string}/users/${this.uid}?token=${Config.TOKEN as string}`

        return await validic.get(url)
    }

    async function provisionUser(): Promise<object> {
        const url = `/organizations/${Config.ORG_ID as string}/users?token=${Config.TOKEN as string}`

        // use library to get real timezone/country
        // react-native-device-info?
        const timezone = 'America/Los_Angeles'
        const country_code = 'US'

        return await validic.post(url, {
            uid: this.uid,
            location: {
                timezone,
                country_code,
            }
        })
    }

    async function getMarketplaceJSON(): Promise<object> {
        const url = `?token=${marketplaceToken}&format=json`

        return await marketplace.get(url)
    }

    function createUID(): string {
        // create non-identifiable uid
        return ''
    }

    function getUID(): string | null {
        // get uid from storage
        return 'sample-uid-1'
    }

    // returns true if uid was created, false if uid was retrieved
    function getOrCreateUID(): boolean {
        this.uid = getUID()

        if (this.uid === null) {
            this.uid = createUID()
            // save uid to storage
            return true
        }
        return false
    }

    function initializeMarketplace(): void {
        const newUser = getOrCreateUID()
        const userDataPromise = newUser ? provisionUser() : getUserProfile()

        userDataPromise.then((response) => {
            this.id = response.data.id
            this.mobileToken = response.data.mobile.token
            setMarketplaceToken(response.data.marketplace.token)
        }).catch((error) => {
            // 404 means user doesn't exist, provision again here?
            console.log(error)
        })
    }

    function addListeners(): void {
        ValidicSessionEvents.addListener('validic:session:onsuccess', (record) => {
            // the record was successfully uploaded to validic servers
            console.log('Successfully got record' + JSON.stringify(record));
        });
        ValidicSessionEvents.addListener('validic:session:onerror', (event) => {
            // an error was returned while submitting the record
            // console.error('Got error: ' + error + ' for record: ' + record.activity_id);
            console.error('Got error: ' + (event as string) + ' for record: ');
        });
        ValidicSessionEvents.addListener('validic:session:onend', (event) => {
            // session ended
            console.log(event);
        });
    }

    function openSession(): void {
        ValidicSession.getUser().then((response) => {
            console.log(response)
            if (response == null) {
                void ValidicSession.startSession({
                    user_id: this.id,
                    user_token: this.mobileToken,
                    org_id: Config.ORG_ID as string,
                })
                console.log('started session')
            } else {
                console.log('session already started')
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    function addSubscription(): void {
        ValidicHealthKit.setSubscriptions([SampleTypes.HKQuantityTypeIdentifierOxygenSaturation]);

        ValidicHealthKit.getCurrentSubscriptions((subscriptions) => {
            console.log(subscriptions)
        })
        console.log('adding subscription')
    }

    return (
        <View>
            <Button
                title="Print Marketplace Token"
                onPress={() => { console.log(marketplaceToken) }}
            />
            <Button
                title="Open Validic Session"
                onPress={() => { openSession() }}
            />
            <Button
                title="End Validic Session"
                onPress={() => { ValidicSession.endSession() }}
            />
            <Button
                title="Add Listeners"
                onPress={() => { addListeners() }}
            />
            <Button
                title="Add Subscriptions"
                onPress={() => { addSubscription() }}
            />
        </View>
    )
}

export default ConnectWearableScreen;
