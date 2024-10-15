<?php

namespace App\ApiResource;

use ApiPlatform\Doctrine\Common\Filter\SearchFilterInterface;
use ApiPlatform\Doctrine\Orm\Filter\AbstractFilter;
use ApiPlatform\Doctrine\Orm\Util\QueryBuilderHelper;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Metadata\Operation;
use Doctrine\ORM\Query\Expr\Join;
use Doctrine\ORM\QueryBuilder;

final class OrSearchFilter extends AbstractFilter implements SearchFilterInterface
{
    /**
     * {@inheritdoc}
     */
    public function getDescription(string $resourceClass): array
    {
        $description = [];

        $properties = $this->getProperties();
        if (null === $properties) {
            $properties = array_fill_keys($this->getClassMetadata($resourceClass)->getFieldNames(), null);
        }

        foreach ($properties as $property => $strategy) {
            if (!$this->isPropertyMapped($property, $resourceClass, true)) {
                continue;
            }

            if ($this->isPropertyNested($property, $resourceClass)) {
                $propertyParts = $this->splitPropertyParts($property, $resourceClass);
                $field = $propertyParts['field'];
                $metadata = $this->getNestedMetadata($resourceClass, $propertyParts['associations']);
            } else {
                $field = $property;
                $metadata = $this->getClassMetadata($resourceClass);
            }

            $propertyName = $this->normalizePropertyName($property);
            if ($metadata->hasField($field)) {
                $strategy = $this->getProperties()[$property] ?? self::STRATEGY_PARTIAL;
                $filterParameterNames = [$propertyName];

                if (\in_array($strategy, [self::STRATEGY_EXACT, self::STRATEGY_IEXACT], true)) {
                    $filterParameterNames[] = $propertyName . '[]';
                }

                foreach ($filterParameterNames as $filterParameterName) {
                    $description[$filterParameterName] = [
                        'property'      => $propertyName,
                        'type'          => 'string',
                        'required'      => false,
                        'strategy'      => $strategy,
                        'is_collection' => str_ends_with((string)$filterParameterName, '[]'),
                    ];
                }
            }
        }

        return $description;
    }

    /** {@inheritdoc } */
    protected function filterProperty(string $property, $value, QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, Operation $operation = null, array $context = []): void
    {
        if (
            null === $value
            || !$this->isPropertyEnabled($property, $resourceClass)
            || !$this->isPropertyMapped($property, $resourceClass, true)
        ) {
            return;
        }

        $alias = $queryBuilder->getRootAliases()[0];
        $field = $property;

        if ($this->isPropertyNested($property, $resourceClass)) {
            [$alias, $field] = $this->addJoinsForNestedProperty($property, $alias, $queryBuilder, $queryNameGenerator, $resourceClass, Join::INNER_JOIN);
        }
        $values = (array)$value;
        $ors = [];
        $parameters = [];
        $valueParameter = ':' . $queryNameGenerator->generateParameterName($field);
        $aliasedField = \sprintf('%s.%s', $alias, $field);

        foreach ($values as $key => $value) {
            $keyValueParameter = \sprintf('%s_%s', $valueParameter, $key);
            $parameters[] = [$value, $keyValueParameter];

            $ors[] = $queryBuilder->expr()->like(
                $aliasedField,
                (string)$queryBuilder->expr()->concat("'%'", $keyValueParameter, "'%'")
            );
        }

        $queryBuilder->orWhere($queryBuilder->expr()->orX(...$ors));
        foreach ($parameters as $parameter) {
            $queryBuilder->setParameter($parameter[1], $parameter[0]);
        }
    }
}