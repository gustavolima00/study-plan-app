import { Image } from "react-native";

export interface AppLogoProps {
    size?: number;
}

export default function AppLogo(props: AppLogoProps) {
    const { size = 100 } = props;
    return (
        <Image
            source={require("../assets/images/app_logo.png")}
            style={{ width: size, height: size }}
        />
    );
}
