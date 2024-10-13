<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\CategoriesRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: CategoriesRepository::class)]
#[ApiResource(formats: 'json')]
class Categories
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups('todoList')]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups('todoList')]
    private ?string $name = null;

    /**
     * @var Collection<int, TodoList>
     */
    #[ORM\OneToMany(targetEntity: TodoList::class, mappedBy: 'category')]
    private Collection $todo;

    public function __construct()
    {
        $this->todo = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @return Collection<int, TodoList>
     */
    public function getTodo(): Collection
    {
        return $this->todo;
    }

    public function addTodo(TodoList $todo): static
    {
        if (!$this->todo->contains($todo)) {
            $this->todo->add($todo);
            $todo->setCategory($this);
        }

        return $this;
    }

    public function removeTodo(TodoList $todo): static
    {
        if ($this->todo->removeElement($todo)) {
            // set the owning side to null (unless already changed)
            if ($todo->getCategory() === $this) {
                $todo->setCategory(null);
            }
        }

        return $this;
    }
}
