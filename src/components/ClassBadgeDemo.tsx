import { ClassBadge } from "./ClassBadge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const classes = [
  "Abyss Walker", "Bishop", "BladeDancer", "Crafter", "Dark Avenger", 
  "Destroyer", "Elemental Summoner", "Elven Elder", "Gladiador", "Hawkeye",
  "Necromancer", "Overlord", "Paladin", "Phantom Ranger", "Phantom Summoner",
  "PlainsWalker", "Prophet", "Shillien Elder", "Shillien Knight", "Silver Ranger",
  "Sorcerer", "Spell Howler", "Spell Singer", "Spoiler", "Sword Singer",
  "Temple Knight", "Treasure Hunter", "Tyrant", "Warcryer", "Warlock", "Warlord"
];

export function ClassBadgeDemo() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Demonstração das Classes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {classes.map((className) => (
            <div key={className} className="flex flex-col items-center space-y-2">
              <ClassBadge classeName={className} size="md" />
              <span className="text-xs text-muted-foreground text-center">
                {className}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
